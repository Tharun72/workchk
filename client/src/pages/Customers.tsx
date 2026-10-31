import { Layout } from "@/components/layout/Layout";
import { CustomersData } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Filter, Download } from "lucide-react";

export default function Customers() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterZone, setFilterZone] = useState<string>("all");

  const filteredData = CustomersData.filter(customer => {
    if (filterType !== "all" && customer.status !== filterType) return false;
    if (filterZone !== "all" && customer.zone !== filterZone) return false;
    return true;
  });

  return (
    <Layout title="Customer Analytics">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Customer Session Details</CardTitle>
          <div className="flex items-center gap-3">
            <Select onValueChange={setFilterType} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-white">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Browse">Browse</SelectItem>
                <SelectItem value="Exit">Exit</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterZone} defaultValue="all">
              <SelectTrigger className="w-[180px] bg-white">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" /> {/* Replaced Filter with MapPin */}
                {/* Note: MapPin needs to be imported, let's fix import */}
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>Dwell Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">{customer.id}</TableCell>
                    <TableCell>{customer.dwellTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-gray-600 border-gray-200">
                        {customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.zone}</TableCell>
                    <TableCell className="text-gray-600">{customer.product}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={customer.status === "Purchase" ? "default" : customer.status === "Exit" ? "destructive" : "secondary"}
                        className="font-medium"
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

// Fix missing imports
import { MapPin } from "lucide-react";
