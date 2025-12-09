import { useState } from 'react';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

function getErrorMessages(error) {
  if (!error) return [];
  if (Array.isArray(error?.detail)) {
    return error.detail.map(item =>
      typeof item === "object" && item !== null
        ? (typeof item.msg === "string" ? item.msg : JSON.stringify(item))
        : (typeof item === "string" ? item : JSON.stringify(item))
    );
  }
  if (typeof error?.detail === "string") {
    return [error.detail];
  }
  if (error?.message) {
    return [error.message];
  }
  if (typeof error === "string") {
    return [error];
  }
  return [JSON.stringify(error)];
}

const Login = ({ onSubmit, onSwitchToRegister, error }) => {
  const { t } = useTranslation('auth');
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={`max-w-md w-full ${colors.background.primary} rounded-lg shadow-lg p-6 md:p-8 border ${colors.border}`}>
      <h2 className={`text-lg md:text-xl font-bold mb-2 md:mb-4 text-center ${colors.text.primary}`}>
        {t('login.title')}
      </h2>

      {error && (
        <div className="mb-3 sm:mb-4 text-red-600 text-center font-semibold text-[11px] sm:text-base">
          {getErrorMessages(error).map((msg, i) => (
            <div key={i}>{String(msg)}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className={`flex items-center gap-2 mb-1 sm:mb-2 text-[11px] sm:text-base ${colors.text.secondary}`}>
            <FaUserCircle className="text-sky-700 w-4 h-4 sm:w-5 sm:h-5" />
            {t('login.usernameLabel')}
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 border ${colors.border} ${colors.background.primary} ${colors.text.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-base`}
            required
          />
        </div>

        <div>
          <label className={`flex items-center gap-2 mb-1 sm:mb-2 text-[11px] sm:text-base ${colors.text.secondary}`}>
            <RiLockPasswordLine className="text-sky-700 w-4 h-4 sm:w-5 sm:h-5" />
            {t('login.passwordLabel')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 border ${colors.border} ${colors.background.primary} ${colors.text.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 sm:pr-12 text-xs sm:text-base`}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} hover:${colors.text.secondary} focus:outline-none`}
            >
              {showPassword
                ? <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                : <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full ${colors.button.primary} py-1.5 sm:py-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm md:text-md mt-3`}
        >
          {t('login.submitButton')}
        </button>

        {/* only show switch link when handler is provided */}
        {onSwitchToRegister && (
          <div className={`text-center text-[11px] sm:text-base ${colors.text.secondary}`}>
            {t('login.switchText')}{' '}
            <button
              type="button"
              className="text-sky-700 hover:underline text-[11px] sm:text-base"
              onClick={onSwitchToRegister}
            >
              {t('login.switchLink')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;