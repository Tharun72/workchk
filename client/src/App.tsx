import { Route, Switch } from "wouter";
import Layout from "./components/layout/Layout";

import Overview from "./pages/Overview";
import Customers from "./pages/Customers";
import Interactions from "./pages/Interactions";
import ZoneAnalytics from "./pages/ZoneAnalytics";
import VideoInsights from "./pages/VideoInsights";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/customers" component={Customers} />
        <Route path="/interactions" component={Interactions} />
        <Route path="/zones" component={ZoneAnalytics} />
        <Route path="/video" component={VideoInsights} />

        {/* fallback */}
        <Route>
          <div style={{ padding: 40 }}>
            <h2>404 - Page Not Found</h2>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
