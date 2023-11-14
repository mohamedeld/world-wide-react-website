function Error({ error }) {
  return (
    <p className="error">
      <span>💥</span> There was an error fecthing questions.
      <p>{error}</p>
    </p>
  );
}

export default Error;
