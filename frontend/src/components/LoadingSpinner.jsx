export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-danger me-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>{message}</div>
    </div>
  );
}
