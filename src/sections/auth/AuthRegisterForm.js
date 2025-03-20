import { useState } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// import { C } from '@fullcalendar/core/internal-common';
import axiosInstance from '../../utils/axios';
import { verifyEmail, resendVerificationCode } from '../../auth/verify-email';

// ----------------------------------------------------------------------

export default function AuthRegisterForm() {  
  const router = useRouter();

  const { register } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  const VerificationSchema = Yup.object().shape({
    verificationCode: Yup.string()
      .required('Verification code is required')
      .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(isVerificationStep ? VerificationSchema : RegisterSchema),
    defaultValues: isVerificationStep ? { verificationCode: '' } : defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    console.log("isVerificationStep" , isVerificationStep);
    try {
      if (!isVerificationStep) {  
        const result = await register(data.email, data.password, data.firstName, data.lastName);
        setUserDetails(data);
        setIsVerificationStep(true);
        reset({ verificationCode: '' });
      } else {
        // Second step: Verify email with code
        await verifyEmail(userDetails.email, data.verificationCode);
        router.push('/auth/login-unprotected');
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  const handleResendCode = async () => {
    try {
      if (!canResend) return;
      
      await resendVerificationCode(userDetails.email);
      
      // Disable resend button for 60 seconds
      setCanResend(false);
      setResendTimer(60);

      // Start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      setError('afterSubmit', {
        message: error.message || 'Failed to resend verification code',
      });
    }
  };

  if (isVerificationStep) {
    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          
          <Typography variant="body2" sx={{ mb: 3 }}>
            Please check your email ({userDetails?.email}). We've sent you a verification code.
          </Typography>

          <RHFTextField
            name="verificationCode"
            label="Verification Code"
            placeholder="Enter 6-digit code"
          />

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting || isSubmitSuccessful}
            sx={{
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              '&:hover': {
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
              },
            }}
          >
            Verify Email
          </LoadingButton>

          <LoadingButton
            color="inherit"
            size="small"
            onClick={handleResendCode}
            disabled={!canResend}
            sx={{ alignSelf: 'center' }}
          >
            {canResend ? 'Resend Code' : `Resend Code (${resendTimer}s)`}
          </LoadingButton>
        </Stack>
      </FormProvider>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isSubmitSuccessful}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
