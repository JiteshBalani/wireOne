import { CalculatorOutlined, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import Calculator from './components/Calculator';
import Configurations from './components/Configurations';
import NewConfig from './components/NewConfig';
import {GithubOutlined } from '@ant-design/icons';

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
    <div className='flex justify-between w-screen bg-[#001529] text-white font-semibold p-2'>

      <h1 className='text-2xl text-center text-white '>Fare Logic</h1>
      <p>Created By: <a className='text-blue-400 mr-1' href='https://github.com/JiteshBalani/wireone' target='blank'>Jitesh Balani</a><GithubOutlined/></p>
    </div>
      <Tabs centered defaultActiveKey='1' items={tabItems} />
    </div>
  )
}
export default App;