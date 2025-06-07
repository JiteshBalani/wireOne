import { CalculatorOutlined, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import Calculator from './components/Calculator';
import Configurations from './components/Configurations';
import NewConfig from './components/NewConfig';

const App = () => {
  const tabItems = [
    {
      key: '1',
      label: <span className='font-semibold text-lg'>Calculator</span>,
      children: <div><Calculator/></div>,
      icon: <CalculatorOutlined/>
    },
    {
      key: '2',
      label: <span className='font-semibold text-lg'>Configurations</span>,
      children: <div><Configurations/></div>,
      icon: <UnorderedListOutlined/>
    },
    {
      key: '3',
      label: <span className='font-semibold text-lg'>New Config</span>,
      children: <div><NewConfig/></div>,
      icon: <SettingOutlined/>
    }
  ]
  return (
    <div>
      <h1 className='text-2xl text-center bg-[#001529] text-white font-semibold p-2'>FareLogic Price Engine</h1>
      {/* <p>Configure and calculate dynamic pricing for ride-sharing services</p> */}
      <Tabs centered defaultActiveKey='1' items={tabItems} />
    </div>
  )
}
export default App;