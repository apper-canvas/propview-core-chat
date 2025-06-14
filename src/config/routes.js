import Search from '@/components/pages/Search';
import Saved from '@/components/pages/Saved';
import About from '@/components/pages/About';

export const routes = {
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  saved: {
    id: 'saved', 
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
    component: Saved
  },
  about: {
    id: 'about',
    label: 'About',
    path: '/about',
    icon: 'Info',
    component: About
  }
};

export const routeArray = Object.values(routes);
export default routes;