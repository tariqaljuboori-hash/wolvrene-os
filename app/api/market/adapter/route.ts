import { NextRequest, NextResponse } from 'next/server';
import { ADAPTERS } from '@/lib/market/adapters';
import { ExchangeId, Timeframe } from '@/types/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exchange = (searchParams.get('exchange') || 'binance') as ExchangeId;
    const mode = searchParams.get('mode') || 'ticker';
    const symbol = searchParams.get('symbol') || 'BTCUSDT';
    const timeframe = (searchParams.get('timeframe') || '1h') as Timeframe;
    const limit = Number(searchParams.get('limit') || '100');

    const adapter = ADAPTERS[exchange] || ADAPTERS.binance;

    if (mode === 'top') {
      return NextResponse.json({ rows: await adapter.getTopSymbols(limit) });
    }
    if (mode === 'candles') {
      return NextResponse.json({ rows: await adapter.getCandles(symbol, timeframe, limit) });
    }
    return NextResponse.json({ row: await adapter.getTicker(symbol) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
