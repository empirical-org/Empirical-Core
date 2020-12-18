import * as React from 'react'

function useSnackbarMonitor(showSnackbar, setShowSnackbar, snackbarTimeout) {
  return React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), snackbarTimeout)
    }
  }, [showSnackbar])
}

export default useSnackbarMonitor
