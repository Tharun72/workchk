import { Layout } from "@/components/layout/Layout";
import { VideoStats } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, Play, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoInsights() {
  return (
    <Layout title="Video Intelligence">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <Card className="border-none shadow-sm bg-gray-900 text-white">
            <CardContent className="p-6">
              <p className="text-gray-400 text-sm font-medium">Frames Analyzed</p>
              <h3 className="text-3xl font-bold mt-2 font-mono">{VideoStats.frames}</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-500 text-sm font-medium">Customers Detected</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-900">{VideoStats.customers}</h3>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-500 text-sm font-medium">Interaction Events</p>
              <h3 className="text-3xl font-bold mt-2 text-blue-600">{VideoStats.events}</h3>
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500 animate-pulse" />
            Live Feed: Zone 1 (Entrance)
          </CardTitle>
          <div className="flex gap-2">
             <Button variant="outline" size="sm">Camera 01</Button>
             <Button variant="ghost" size="sm" className="text-gray-400">Camera 02</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-black relative aspect-video group">
          {/* Mock Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
             <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:border-blue-500 transition-colors cursor-pointer">
                   <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <p className="text-gray-400 text-sm">Live Stream Connection Active</p>
                <p className="text-gray-600 text-xs mt-1">1920x1080 • 60FPS • H.264</p>
             </div>
          </div>
          
          {/* Overlay UI */}
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded-sm font-bold animate-pulse">
            REC
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs space-y-1">
                <p><span className="text-gray-400">Detected:</span> 4 People</p>
                <p><span className="text-gray-400">Zone:</span> Entrance Area</p>
                <p><span className="text-gray-400">Confidence:</span> 98.2%</p>
             </div>
             
             <Button size="icon" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
               <Maximize2 className="w-4 h-4" />
             </Button>
          </div>

          {/* Bounding Boxes Mock */}
          <div className="absolute top-[30%] left-[20%] w-[100px] h-[200px] border-2 border-green-500 opacity-60 pointer-events-none">
             <div className="bg-green-500 text-black text-[10px] px-1 absolute -top-4 left-0 font-bold">Person 98%</div>
          </div>
          <div className="absolute top-[40%] right-[30%] w-[120px] h-[180px] border-2 border-green-500 opacity-60 pointer-events-none">
             <div className="bg-green-500 text-black text-[10px] px-1 absolute -top-4 left-0 font-bold">Person 92%</div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
           <h4 className="text-sm font-semibold text-yellow-800">Privacy Notice</h4>
           <p className="text-sm text-yellow-700 mt-1">
             All video processing is performed locally on the edge device. No personal identifiable information (PII) is stored on the cloud servers in compliance with GDPR regulations.
           </p>
        </div>
      </div>
    </Layout>
  );
}
