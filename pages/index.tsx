
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import _ from 'lodash';
import React from 'react';

type TimeBlock = 'morning' | 'afternoon' | 'evening';
type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

interface DayData {
  morning: number | null;
  afternoon: number | null;
  evening: number | null;
}

interface WeekData {
  monday: DayData;
  tuesday: DayData;
  wednesday: DayData;
  thursday: DayData;
  friday: DayData;
}

interface Patterns {
  bestTimes: string[];
  challengeTimes: string[];
  consistentPeriods: string[];
}

const Home: NextPage = () => {
  const [weekData, setWeekData] = useState<WeekData>({
    monday: { morning: null, afternoon: null, evening: null },
    tuesday: { morning: null, afternoon: null, evening: null },
    wednesday: { morning: null, afternoon: null, evening: null },
    thursday: { morning: null, afternoon: null, evening: null },
    friday: { morning: null, afternoon: null, evening: null }
  });

  const [patterns, setPatterns] = useState<Patterns>({
    bestTimes: [],
    challengeTimes: [],
    consistentPeriods: []
  });

  const energyLevels = React.useMemo(() => [
    { value: 4, label: '⚡️ High', color: 'bg-green-100' },
    { value: 3, label: '✨ Good', color: 'bg-blue-100' },
    { value: 2, label: '💫 Low', color: 'bg-yellow-100' },
    { value: 1, label: '🔋 Rest', color: 'bg-red-100' }
  ], []);

  const handleEnergyUpdate = (day: Day, timeBlock: TimeBlock, value: number) => {
    setWeekData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeBlock]: value
      }
    }));
  };

  useEffect(() => {
    const analyzePatterns = () => {
      const timeBlocks: TimeBlock[] = ['morning', 'afternoon', 'evening'];
      const days = Object.keys(weekData) as Day[];

      const averages = timeBlocks.map(block => {
        const values = days
          .map(day => weekData[day][block])
          .filter((val): val is number => val !== null);
        return {
          timeBlock: block,
          average: values.length > 0 ? _.mean(values) : 0
        };
      });

      const bestTimes = averages
        .filter(({ average }) => average >= 3)
        .map(({ timeBlock }) => timeBlock);

      const challengeTimes = averages
        .filter(({ average }) => average <= 2)
        .map(({ timeBlock }) => timeBlock);

      const consistentPeriods = timeBlocks.filter(block => {
        const values = days
          .map(day => weekData[day][block])
          .filter((val): val is number => val !== null);
        return values.length >= 3 && _.uniq(values).length === 1;
      });

      setPatterns({
        bestTimes,
        challengeTimes,
        consistentPeriods
      });
    };

    analyzePatterns();
  }, [weekData]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Weekly Energy Pattern Tracker</h2>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="font-bold">Time</th>
                <th className="font-bold">Mon</th>
                <th className="font-bold">Tue</th>
                <th className="font-bold">Wed</th>
                <th className="font-bold">Thu</th>
                <th className="font-bold">Fri</th>
              </tr>
            </thead>
            <tbody>
              {(['morning', 'afternoon', 'evening'] as const).map(timeBlock => (
                <tr key={timeBlock}>
                  <td className="capitalize">{timeBlock}</td>
                  {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map(day => (
                    <td key={`${day}-${timeBlock}`}>
                      <select
                        value={weekData[day][timeBlock]?.toString() || ''}
                        onChange={(e) => handleEnergyUpdate(day, timeBlock, Number(e.target.value))}
                        className="p-2 border rounded"
                      >
                        <option value="">Select</option>
                        {energyLevels.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Pattern Analysis</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Best Energy Times:</h3>
              {patterns.bestTimes.length > 0 ? (
                <ul className="list-disc pl-5">
                  {patterns.bestTimes.map(time => (
                    <li key={time} className="capitalize">{time}</li>
                  ))}
                </ul>
              ) : (
                <p>No consistent high energy times detected yet</p>
              )}
            </div>

            <div>
              <h3 className="font-bold">Challenge Times:</h3>
              {patterns.challengeTimes.length > 0 ? (
                <ul className="list-disc pl-5">
                  {patterns.challengeTimes.map(time => (
                    <li key={time} className="capitalize">{time}</li>
                  ))}
                </ul>
              ) : (
                <p>No consistent challenge times detected yet</p>
              )}
            </div>

            <div>
              <h3 className="font-bold">Consistent Periods:</h3>
              {patterns.consistentPeriods.length > 0 ? (
                <ul className="list-disc pl-5">
                  {patterns.consistentPeriods.map(period => (
                    <li key={period} className="capitalize">{period}</li>
                  ))}
                </ul>
              ) : (
                <p>No consistent patterns detected yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Recommendations</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patterns.bestTimes.length > 0 && (
              <div className="p-4 bg-green-50 rounded">
                <h3 className="font-bold">Leverage Your Peak Times:</h3>
                <p>Schedule important tasks during your high energy periods: {patterns.bestTimes.join(', ')}</p>
              </div>
            )}

            {patterns.challengeTimes.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded">
                <h3 className="font-bold">Support Needed:</h3>
                <p>Plan extra support or breaks during: {patterns.challengeTimes.join(', ')}</p>
              </div>
            )}

            {patterns.consistentPeriods.length > 0 && (
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-bold">Build on Consistency:</h3>
                <p>You have consistent energy during: {patterns.consistentPeriods.join(', ')}. Consider building routines around these times.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;