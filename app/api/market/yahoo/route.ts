import { NextResponse } from 'next/server';

function yahooInterval(tf: string) {
  return ({
    '1m': '1m',
    '3m': '5m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '60m',
    '2h': '60m',
    '4h': '60m',
    '1d': '1d',
    '1w': '1wk',
    '1M': '1mo',
  } as Record<string, string>)[tf] ?? '1h';
}

function yahooRange(tf: string) {
  if (['1m', '3m', '5m', '15m', '30m'].includes(tf)) return '5d';
  if (['1h', '2h', '4h'].includes(tf)) return '1mo';
  if (tf === '1d') return '1y';
  return '5y';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval') ?? '1h';

  if (!symbol) {
    return NextResponse.json({ candles: [] }, { status: 400 });
  }

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=${yahooInterval(interval)}&range=${yahooRange(interval)}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const json = await res.json();
    const result = json.chart?.result?.[0];
    const timestamps: number[] = result?.timestamp ?? [];
    const quote = result?.indicators?.quote?.[0];

    if (!quote || !timestamps.length) {
      return NextResponse.json({ candles: [] });
    }

    const candles = timestamps
      .map((t, i) => ({
        time: t * 1000,
        o: Number(quote.open?.[i]),
        h: Number(quote.high?.[i]),
        l: Number(quote.low?.[i]),
        c: Number(quote.close?.[i]),
        v: Number(quote.volume?.[i] ?? 0),
      }))
      .filter(
        (c) =>
          Number.isFinite(c.time) &&
          Number.isFinite(c.o) &&
          Number.isFinite(c.h) &&
          Number.isFinite(c.l) &&
          Number.isFinite(c.c)
      );

    return NextResponse.json({ candles });
  } catch {
    return NextResponse.json({ candles: [] }, { status: 500 });
  }
}