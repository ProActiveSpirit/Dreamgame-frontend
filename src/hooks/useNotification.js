import { useSnackbar } from 'notistack';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = {
    success: (message) => {
      enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    },

    error: (message) => {
      enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    },

    warning: (message) => {
      enqueueSnackbar(message, {
        variant: 'warning',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    },

    info: (message) => {
      enqueueSnackbar(message, {
        variant: 'info',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    },
  };

  return showNotification;
}; 