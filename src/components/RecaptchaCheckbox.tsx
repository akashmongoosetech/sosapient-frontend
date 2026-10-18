import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// Minimal typings for Google's grecaptcha (v2 checkbox) loaded into the page.
declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    __sosapientRecaptchaOnLoad?: () => void;
  }
}

const SCRIPT_ID = 'google-recaptcha-v2';
const SCRIPT_SRC =
  'https://www.google.com/recaptcha/api.js?onload=__sosapientRecaptchaOnLoad&render=explicit';

// Google issues 40-char site keys that always start with "6L". Catching obvious
// placeholders/typos here avoids a confusing "Invalid site key" error that only
// appears once Google's script has already loaded.
const SITE_KEY_PATTERN = /^6L[\w-]{38}$/;

// The v2 checkbox is a fixed-size widget. We scale it down (via CSS transform)
// when the container is narrower so it always fits inside its card — it is
// rendered at 304x78 and would otherwise overflow narrow form columns.
const WIDGET_WIDTH = 304;
const WIDGET_HEIGHT = 78;
const MIN_SCALE = 0.7;

// Module-level, idempotent loader. Shared across every mount so the script is
// fetched once and React StrictMode's double-invoke cannot create duplicates.
let loaderPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
    return Promise.resolve();
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    // Google calls this global once the api.js bundle has loaded.
    window.__sosapientRecaptchaOnLoad = () => resolve();
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error('Failed to load reCAPTCHA'));
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
}

export interface RecaptchaHandle {
  /** Current token, or '' when unsolved/expired. */
  getToken: () => string;
  /** Clear the response and let the user solve it again. */
  reset: () => void;
}

interface RecaptchaCheckboxProps {
  /** Public site key (VITE_RECAPTCHA_SITE_KEY). Never the secret. */
  siteKey: string;
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
}

const RecaptchaCheckbox = forwardRef<RecaptchaHandle, RecaptchaCheckboxProps>(
  function RecaptchaCheckbox({ siteKey, onChange, onExpired, onError, theme = 'light' }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<number | null>(null);
    const tokenRef = useRef<string>('');
    const [failed, setFailed] = useState(false);
    const [scale, setScale] = useState(1);
    const siteKeyLooksValid = SITE_KEY_PATTERN.test(siteKey);

    // Keep the latest callbacks without re-running the render effect.
    const cbRef = useRef({ onChange, onExpired, onError });
    cbRef.current = { onChange, onExpired, onError };

    useImperativeHandle(
      ref,
      () => ({
        getToken: () => {
          try {
            if (widgetIdRef.current !== null && window.grecaptcha) {
              return window.grecaptcha.getResponse(widgetIdRef.current) || '';
            }
          } catch {
            /* fall through to cached token */
          }
          return tokenRef.current || '';
        },
        reset: () => {
          tokenRef.current = '';
          try {
            if (widgetIdRef.current !== null && window.grecaptcha) {
              window.grecaptcha.reset(widgetIdRef.current);
            }
          } catch {
            /* ignore */
          }
          cbRef.current.onChange?.(null);
        },
      }),
      []
    );

    useEffect(() => {
      let cancelled = false;

      if (!SITE_KEY_PATTERN.test(siteKey)) {
        if (siteKey && import.meta.env.DEV) {
          console.warn(
            '[RecaptchaCheckbox] VITE_RECAPTCHA_SITE_KEY is missing or malformed. ' +
              'Create a reCAPTCHA v2 "I\'m not a robot" Checkbox key at ' +
              'https://www.google.com/recaptcha/admin and restart the dev server.'
          );
        }
        setFailed(true);
        return () => {
          cancelled = true;
        };
      }

      loadRecaptchaScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.grecaptcha) return;
          if (widgetIdRef.current !== null) return; // already rendered
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              theme,
              callback: (token: string) => {
                tokenRef.current = token;
                cbRef.current.onChange?.(token);
              },
              'expired-callback': () => {
                tokenRef.current = '';
                cbRef.current.onExpired?.();
                cbRef.current.onChange?.(null);
              },
              'error-callback': () => {
                tokenRef.current = '';
                cbRef.current.onError?.();
              },
            });
          } catch {
            setFailed(true);
          }
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });

      return () => {
        cancelled = true;
      };
    }, [siteKey, theme]);

    // Keep the widget inside its container at any viewport/column width.
    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;

      const measure = () => {
        const available = el.clientWidth;
        if (!available) return;
        const next = Math.min(1, Math.max(MIN_SCALE, available / WIDGET_WIDTH));
        setScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
      };

      measure();

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
      }
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [siteKeyLooksValid]);

    if (!siteKeyLooksValid || failed) {
      return (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {siteKey && siteKeyLooksValid
            ? 'CAPTCHA failed to load. If this keeps happening, the reCAPTCHA site key is invalid or not enabled for this domain.'
            : 'CAPTCHA is not configured. Please contact support.'}
        </p>
      );
    }

    // Scale-to-fit: the outer wrapper measures the available width, the middle
    // box owns the scaled layout size (so nothing overflows / shifts) and the
    // inner box is Google's fixed 304x78 widget, shrunk from the top-left so it
    // stays aligned with the form fields.
    return (
      <div ref={wrapRef} className="w-full">
        <div
          style={{ width: Math.round(WIDGET_WIDTH * scale), height: Math.round(WIDGET_HEIGHT * scale) }}
        >
          <div
            ref={containerRef}
            style={{
              width: WIDGET_WIDTH,
              height: WIDGET_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      </div>
    );
  }
);

export default RecaptchaCheckbox;
