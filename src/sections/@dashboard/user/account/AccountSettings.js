// form
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { Card, Stack, Typography, Switch, Container, TextField, CardHeader, CardContent, Modal, Box, Button, Alert, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFSwitch } from '../../../../components/hook-form';
import QRCode from 'qrcode.react';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { verify2FA, useEnable2FA, setup2FA, disable2FA, resendEmailVerification, get2FAStatus } from '../../../../auth/security-utils';
import Image from 'next/image'; // For Next.js
import { useNotification } from '../../../../hooks/useNotification';

export default function AccountSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, refresh } = useAuthContext();
  const notification = useNotification();
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [disableToken, setDisableToken] = useState('');
  const [otpauth_url, setOtpauth_url] = useState('');

  // Use useCallback for status check
  const checkStatus = useCallback(async () => {
    try {
      const response = await get2FAStatus();
      setIs2FAEnabled(response.success);
    } catch (error) {
      console.error('Failed to get 2FA status:', error);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    // Clean up function
    return () => {
      setIs2FAEnabled(false);
      setShowQRModal(false);
      setShowVerifyModal(false);
      setLoading(false);
    };
  }, [checkStatus]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await resendEmailVerification(user.email);
      setError('');
      // Show success message
    } catch (err) {
      setError('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      await disable2FA(disableToken);
      setIs2FAEnabled(false);
      setShowVerifyModal(false);
      setDisableToken('');
      
      // Refresh status instead of using refresh()
      await checkStatus();
      
      notification.success('2FA disabled successfully');
    } catch (err) {
      notification.error(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    try {
      setLoading(true);
      if (!is2FAEnabled) {
        const response = await setup2FA();
        setQRCodeData(response.data.qrCode);
        setShowQRModal(true);
        setOtpauth_url(response.data.otpauth_url);
      } else {
        setShowVerifyModal(true);
      }
      setError('');
    } catch (err) {
      notification.error('Failed to update 2FA settings');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      const response = await useEnable2FA(verificationCode);
      setIs2FAEnabled(true);
      setShowQRModal(false);
      setVerificationCode('');
      
      // Refresh status instead of using refresh()
      await checkStatus();
      
      notification.success('2FA enabled successfully');
    } catch (err) {
      notification.error(err.message || 'Invalid verification code');
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Modal close handlers
  const handleCloseQRModal = () => {
    if (!loading) {
      setShowQRModal(false);
      setQRCodeData('');
      setVerificationCode('');
    }
  };

  const handleCloseVerifyModal = () => {
    if (!loading) {
      setShowVerifyModal(false);
      setDisableToken('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Card>
        <CardHeader title="Security Settings" />
        <CardContent>
          <Stack spacing={3}>
            {/* Email Verification Status */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1">Email Verification</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user?.emailVerified ? 'Email is verified' : 'Email is not verified'}
                </Typography>
              </Box>
              {!user?.emailVerified && (
                <LoadingButton
                  variant="outlined"
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    handleResendVerification();
                  }}
                >
                  Resend Verification
                </LoadingButton>
              )}
            </Stack>

            {/* 2FA Toggle */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1">Two-Factor Authentication</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
              </Box>
              <Switch
                checked={is2FAEnabled}
                onChange={handle2FAToggle}
                // disabled={loading || !user?.emailVerified}
              />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </CardContent>
      </Card>

      {/* Disable 2FA Verification Modal */}
      <Modal
        open={showVerifyModal}
        onClose={handleCloseVerifyModal}
        aria-labelledby="2fa-disable-modal"
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
              Disable Two-Factor Authentication
            </Typography>

            <Typography variant="body2" color="error">
              Warning: This will disable 2FA for your account
            </Typography>

            <Typography variant="body2">
              Enter your authenticator code to confirm
            </Typography>

            <TextField
              fullWidth
              label="Verification Code"
              value={disableToken}
              onChange={(e) => setDisableToken(e.target.value)}
              disabled={loading}
              placeholder="Enter 6-digit code"
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*'
              }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCloseVerifyModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={handleDisable2FA}
                loading={loading}
                disabled={!disableToken}
              >
                Disable 2FA
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        open={showQRModal}
        onClose={handleCloseQRModal}
        aria-labelledby="2fa-setup-modal"
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
              Set up Two-Factor Authentication
            </Typography>

            <Typography variant="body2">
              1. Scan this QR code with your authenticator app
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {qrCodeData && (
              <Image
                src={qrCodeData}
                alt="2FA QR Code"
                width={200}
                height={200}
                priority
              />
            )}
            
            </Box>
            {otpauth_url && (
              <Typography
                variant="body2"
                sx={{
                  maxWidth: '450px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                }}
              >
                {otpauth_url}
              </Typography>
            )}
            <Typography variant="body2">
              2. Enter the verification code from your authenticator app
            </Typography>

            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={loading}
              placeholder="Enter 6-digit code"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCloseQRModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleVerify2FA}
                loading={loading}
                disabled={!verificationCode}
              >
                Verify
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
