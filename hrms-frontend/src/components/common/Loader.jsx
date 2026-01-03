import "../../styles/components/loader.css";

const Loader = () => {
  return (
    <div className="inline-loader">
      <div className="loader-spinner" />
      <p className="loader-text">Preparing your workspace…</p>

    </div>
  );
};

export default Loader;
