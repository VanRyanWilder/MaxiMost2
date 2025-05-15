import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Logo } from "@/components/ui/logo";
import { Loading } from "@/components/ui/loading";

export default function BrandingPage() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">MaxiMost Branding</h1>
        
        <Tabs defaultValue="logos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="logos">Logo Options</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
            <TabsTrigger value="components">UI Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Primary Logo</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-50 p-6 flex flex-col items-center">
                <div className="mb-6">
                  <Logo size="large" textVisible={true} />
                </div>
                <p className="text-sm text-gray-600 mt-2">Main application logo</p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Logo 1</CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-50 p-6 flex flex-col items-center">
                  <img 
                    src="/images/maximost-alt-logo.png" 
                    alt="MaxiMost Alternative Logo" 
                    className="h-20 object-contain" 
                  />
                  <p className="text-sm text-gray-600 mt-2">Used for loading states and secondary branding</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Logo 2</CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-50 p-6 flex flex-col items-center">
                  <img 
                    src="/images/maximost-alt-logo2.png" 
                    alt="MaxiMost Alternative Logo 2" 
                    className="h-20 object-contain" 
                  />
                  <p className="text-sm text-gray-600 mt-2">Secondary option with classic and modern elements</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Logo with Loading State</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-50 p-6">
                <Loading size="large" text="Loading MaxiMost..." />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-blue-600"></div>
                    <p className="mt-2 font-medium">Primary Blue</p>
                    <p className="text-xs text-gray-500">#2563eb</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-blue-800"></div>
                    <p className="mt-2 font-medium">Dark Blue</p>
                    <p className="text-xs text-gray-500">#1e40af</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-gray-800"></div>
                    <p className="mt-2 font-medium">Dark Gray</p>
                    <p className="text-xs text-gray-500">#1f2937</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-white border border-gray-200"></div>
                    <p className="mt-2 font-medium">White</p>
                    <p className="text-xs text-gray-500">#ffffff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Accent Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-green-500"></div>
                    <p className="mt-2 font-medium">Success</p>
                    <p className="text-xs text-gray-500">#22c55e</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-red-500"></div>
                    <p className="mt-2 font-medium">Error</p>
                    <p className="text-xs text-gray-500">#ef4444</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-yellow-500"></div>
                    <p className="mt-2 font-medium">Warning</p>
                    <p className="text-xs text-gray-500">#eab308</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-md bg-purple-500"></div>
                    <p className="mt-2 font-medium">Highlight</p>
                    <p className="text-xs text-gray-500">#a855f7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Primary Button
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md">
                      Secondary Button
                    </button>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md">
                      Outline Button
                    </button>
                    <button className="bg-transparent text-blue-600 hover:underline px-4 py-2">
                      Text Button
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold">Heading 1</h1>
                      <p className="text-sm text-gray-500">3xl / Bold</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Heading 2</h2>
                      <p className="text-sm text-gray-500">2xl / Bold</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Heading 3</h3>
                      <p className="text-sm text-gray-500">xl / Semibold</p>
                    </div>
                    <div>
                      <p className="text-base">Body text</p>
                      <p className="text-sm text-gray-500">base / Normal</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Small text</p>
                      <p className="text-sm text-gray-500">sm / Normal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}