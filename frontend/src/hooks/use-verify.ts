import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";

export default function useVerify() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify()
      .unwrap()
      .then((res) => {
        console.log('useVerify: verify success', res);
        dispatch(setAuth());
      })
      .catch((err) => {
        console.log('useVerify: verify failed', err);
        // Optionally handle error
      })
      .finally(() => {
        console.log('useVerify: finishInitialLoad');
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify]);

  return null;
}
