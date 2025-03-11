import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Modal, Box, Typography, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { verify2FA, useEnable2FA, setup2FA, disable2FA, 
 get2FAStatus } from '../../auth/security-utils';

// redux
import { setUserSuccess } from '../../redux/slices/user';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login } = useAuthContext();
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [googleAuthCode, setGoogleAuthCode] = useState('');
  const [tempUserData, setTempUserData] = useState(null);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      setTempUserData(data);
      sessionStorage.setItem('userEmail', data.email);

      const response = await get2FAStatus();
      console.log("response" , response);
      if(response.success)
        setShowGoogleAuthModal(true);
      else
        router.push('/dashboard/app');
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
      sessionStorage.removeItem('userEmail');
    }
  };

  const handleGoogleAuthSubmit = async () => {
    try {
      await verify2FA(googleAuthCode);

      setShowGoogleAuthModal(false);
      setGoogleAuthCode('');
      setTempUserData(null);

      router.push('/dashboard/app');
    } catch (error) {
      setError('googleAuth', {
        message: 'Invalid authentication code',
      });
    }
  };

  const handleCancelAuth = () => {
    setShowGoogleAuthModal(false);
    setGoogleAuthCode('');
    setTempUserData(null);
    // Reset form and loading state
    reset();
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="email" label="Email address" error={!!errors.email} helperText={errors.email?.message} />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password?.message}
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
        </Stack>

        <Stack alignItems="flex-end" sx={{ my: 2 }}>
          <Link
            component={NextLink}
            href={PATH_AUTH.resetPassword}
            variant="body2"
            color="inherit"
            underline="always"
          >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitSuccessful || isSubmitting}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Login
        </LoadingButton>
      </FormProvider>

      {/* Google Authentication Modal */}
      <Modal
        open={showGoogleAuthModal}
        onClose={handleCancelAuth}
        aria-labelledby="google-auth-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" component="h2">
              Two-Factor Authentication Required
            </Typography>

            <Typography variant="body2">
              Please enter the verification code from your Google Authenticator app
            </Typography>

            <TextField
              fullWidth
              label="Authentication Code"
              value={googleAuthCode}
              onChange={(e) => setGoogleAuthCode(e.target.value)}
              error={!!errors.googleAuth}
              helperText={errors.googleAuth?.message}
              placeholder="Enter 6-digit code"
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
              }}
            />

            {!!errors.googleAuth && (
              <Alert severity="error">{errors.googleAuth.message}</Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCancelAuth}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleGoogleAuthSubmit}
                loading={isSubmitting}
                disabled={!googleAuthCode || googleAuthCode.length !== 6}
              >
                Verify
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}