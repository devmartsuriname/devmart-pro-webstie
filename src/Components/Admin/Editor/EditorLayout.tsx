import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface EditorLayoutProps {
  tabs: Tab[];
  sidebar: ReactNode;
  defaultTab?: string;
}

const EditorLayout = ({ tabs, sidebar, defaultTab }: EditorLayoutProps) => {
  return (
    <div 
      className="min-h-screen pb-12"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--admin-bg-base)) 0%, hsl(222 47% 8%) 100%)'
      }}
    >
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={defaultTab || tabs[0]?.id} className="w-full">
              <TabsList className="w-full justify-start border-b border-[hsl(var(--admin-border-subtle))] bg-transparent rounded-none h-auto p-0 mb-6">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="px-4 py-3 text-sm font-medium text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] data-[state=active]:text-[hsl(var(--admin-text-primary))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--admin-brand-1))] rounded-none bg-transparent"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="bg-[hsl(var(--admin-bg-card))] border border-[hsl(var(--admin-border-subtle))] rounded-2xl p-6 shadow-lg">
                    {tab.content}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-4">
            {sidebar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
