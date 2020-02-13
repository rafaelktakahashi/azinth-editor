interface SuccessModalResponse<T> {
  success: true;
  canceled: boolean;
  value: T;
}

interface FailureModalResponse {
  success: false;
  canceled: boolean;
  value: null;
}

type ModalResponse<T> = SuccessModalResponse<T> | FailureModalResponse;

export default ModalResponse;
