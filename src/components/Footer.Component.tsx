import "../styles/footer.scss";

const FooterComponent = () => {
  return (
    <footer className="wdc-footer-container">
      <div className="wdc-footer-app-info">
        <div className="wdc-footer-app-author">Made by Ed (<span className="wdc-logo-first-letter">エ</span>ヂイ)</div>
        <div className="wdc-footer-app-version">version {process.env.REACT_APP_VERSION}</div>
      </div>
    </footer>
  );
};

export default FooterComponent;
