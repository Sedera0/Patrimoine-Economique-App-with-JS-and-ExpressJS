import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function CalculateButton({ calculatePatrimoineValue }) {
  return (
    <div className='calcBtn'>
      <Button variant="secondary" onClick={calculatePatrimoineValue}>
        Calculer le patrimoine
      </Button>
    </div>
  );
}

CalculateButton.propTypes = {
  calculatePatrimoineValue: PropTypes.func.isRequired,
};

export default CalculateButton;
