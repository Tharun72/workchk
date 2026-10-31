import { Layout } from "@/components/layout/Layout";
import { InteractionsData, RecentInteractionsTable } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Interactions() {
  return (
    <Layout title="Product Interactions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="border-none shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Most Interacted Products</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={InteractionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="product" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar 
                    dataKey="interactions" 
                    fill="#2563eb" 
                    radius={[4, 4, 0, 0]} 
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Interactions Table */}
        <Card className="border-none shadow-sm lg:col-span-3">
           <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Interaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RecentInteractionsTable.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-gray-500 font-mono text-xs">{event.time}</TableCell>
                      <TableCell className="font-medium text-gray-900">{event.id}</TableCell>
                      <TableCell className="text-blue-600">{event.customer}</TableCell>
                      <TableCell>{event.product}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {event.type}
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
