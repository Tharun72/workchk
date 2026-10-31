import { Layout } from "@/components/layout/Layout";
import { ZoneAnalyticsData } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Map, MapPin } from "lucide-react";

export default function ZoneAnalytics() {
  // Sort data for the chart to be more visual
  const chartData = [...ZoneAnalyticsData].sort((a, b) => b.visits - a.visits);

  const getIntensityColor = (visits: number) => {
    if (visits > 4000) return "#1e3a8a"; // Dark blue
    if (visits > 3000) return "#1d4ed8";
    if (visits > 2000) return "#3b82f6";
    return "#93c5fd"; // Light blue
  };

  return (
    <Layout title="Zone Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-blue-100 text-sm font-medium">Total Active Zones</p>
                   <h3 className="text-3xl font-bold mt-2">12</h3>
                </div>
                <Map className="text-blue-200 h-10 w-10 opacity-50" />
             </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-gray-500 text-sm font-medium">Most Visited Zone</p>
                   <h3 className="text-3xl font-bold mt-2 text-gray-900">Running</h3>
                   <p className="text-green-600 text-sm font-medium mt-1">+12% vs last week</p>
                </div>
                <MapPin className="text-gray-200 h-10 w-10" />
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Zone Visit Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="zone" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="visits" radius={[0, 4, 4, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getIntensityColor(entry.visits)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
           <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="rounded-md border border-gray-100">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Zone</TableHead>
                     <TableHead>Visits</TableHead>
                     <TableHead>Avg. Dwell</TableHead>
                     <TableHead>Density</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {ZoneAnalyticsData.map((zone) => (
                     <TableRow key={zone.zone}>
                       <TableCell className="font-medium">{zone.zone}</TableCell>
                       <TableCell>{zone.visits.toLocaleString()}</TableCell>
                       <TableCell>{zone.dwell}</TableCell>
                       <TableCell>
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${zone.density === 'High' ? 'bg-red-50 text-red-700' : 
                              zone.density === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}
                          `}>
                            {zone.density}
                          </span>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
