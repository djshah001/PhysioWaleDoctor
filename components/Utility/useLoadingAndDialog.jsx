import { useState } from "react";

const useLoadingAndDialog = () => {
  const [IsLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [Error, setError] = useState('Server Error');

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return {
    IsLoading,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
    Error,
    setError,
  };
};

export default useLoadingAndDialog;
