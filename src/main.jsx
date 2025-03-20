
import { createRoot } from 'react-dom/client'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>,
)
