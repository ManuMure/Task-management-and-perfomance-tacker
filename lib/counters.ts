import { getCollection } from "@/lib/collections";

interface CounterDoc {
  _id: string;
  seq: number;
}

/**
 * Atomically returns the next number in a named sequence (e.g. "taskId").
 * Safe under concurrent requests - $inc + upsert is a single atomic
 * operation in MongoDB, so two simultaneous calls can never get the same
 * number.
 */
export async function getNextSequence(counterName: string): Promise<number> {
  const counters = await getCollection<CounterDoc>("counters");
  const result = await counters.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return result!.seq;
}