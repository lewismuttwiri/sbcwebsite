import os
import logging
import logging.handlers
from datetime import datetime

# Create logs directory if it doesn't exist
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs')
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Configure logger
def get_logger(name, log_level=logging.INFO):
    """
    Creates and returns a logger with the specified name and log level.
    
    Args:
        name (str): Name of the logger, typically the module name
        log_level (int): Logging level (default: logging.INFO)
        
    Returns:
        logging.Logger: Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    
    # Prevent adding handlers multiple times
    if not logger.handlers:
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(console_format)
        logger.addHandler(console_handler)
        
        # File handler - daily rotating file
        today = datetime.now().strftime('%Y-%m-%d')
        file_handler = logging.handlers.TimedRotatingFileHandler(
            filename=os.path.join(LOGS_DIR, f'{today}.log'),
            when='midnight',
            backupCount=30  # Keep logs for 30 days
        )
        file_handler.setLevel(log_level)
        file_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_format)
        logger.addHandler(file_handler)
    
    return logger

# Create default application logger
app_logger = get_logger('sbcwebsite')

# Log decorator for functions
def log_function_call(logger=None):
    """
    Decorator to log function calls, arguments, and return values.
    
    Args:
        logger (logging.Logger, optional): Logger to use. If None, uses app_logger.
        
    Returns:
        function: Decorated function
    """
    if logger is None:
        logger = app_logger
        
    def decorator(func):
        def wrapper(*args, **kwargs):
            func_name = func.__name__
            logger.debug(f"Calling {func_name} with args: {args}, kwargs: {kwargs}")
            try:
                result = func(*args, **kwargs)
                logger.debug(f"{func_name} returned: {result}")
                return result
            except Exception as e:
                logger.exception(f"Exception in {func_name}: {str(e)}")
                raise
        return wrapper
    return decorator
