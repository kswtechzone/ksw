import { NextResponse } from 'next/server';

type Handler<T = unknown, P extends Record<string, string> = Record<string, string>> = (
  req: Request,
  context: { params: Promise<P> }
) => Promise<NextResponse<T>>;

interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export function apiHandler<T, P extends Record<string, string> = Record<string, string>>(
  handler: Handler<T, P>
): Handler<T, P> {
  return async (req, context) => {
    const start = performance.now();
    const url = new URL(req.url);

    try {
      const response = await handler(req, context);

      const duration = Math.round(performance.now() - start);
      console.log(`${req.method} ${url.pathname} ${response.status} ${duration}ms`);

      return response;
    } catch (error) {
      const duration = Math.round(performance.now() - start);
      const err = error as ApiError;
      const status = err.status || 500;
      const message = err.message || 'Internal server error';

      console.error(`${req.method} ${url.pathname} ${status} ${duration}ms - ${message}`);

      if (status >= 500) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 }) as NextResponse<T>;
      }

      return NextResponse.json(
        { message, ...(process.env.NODE_ENV === 'development' ? { details: err.details } : {}) },
        { status }
      ) as NextResponse<T>;
    }
  };
}

export function createApiError(message: string, status: number, details?: unknown): ApiError {
  return { message, status, details };
}
