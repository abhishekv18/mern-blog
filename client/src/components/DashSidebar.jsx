import { Sidebar } from 'flowbite-react'
import { useDispatch } from 'react-redux';
import { useLocation ,Link} from "react-router-dom"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react'
import { signoutSuccess } from '../redux/user/userSlice';
import { HiArrowSmRight, HiDocumentText, HiOutlineChartPie, HiOutlineChat, HiOutlineUserGroup, HiUser } from "react-icons/hi";
export default function DashSidebar() {
  const dispatch=useDispatch();
  const { currentUser } = useSelector((state) => state.user);
    const location=useLocation()
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
        <Link to={'/dashboard?tab=profile'}>
          <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin':'User'} labelColor='dark' as='div'>
            Profile
          </Sidebar.Item>
         </Link>
         {
          currentUser.isAdmin && (
            <Link to='/dashboard?tab=comp'>
            <Sidebar.Item
              as='div' icon={HiOutlineChartPie} active={tab==='comp'}
              >
             Dashboard
            </Sidebar.Item>
            </Link>
          )
         }

         {
          currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
            <Sidebar.Item
              as='div' icon={HiDocumentText} active={tab==='posts'}
              >
             Posts
            </Sidebar.Item>
            </Link>
          )
         }
         {
          currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
            <Sidebar.Item
              as='div' icon={HiOutlineUserGroup} active={tab==='users'}
              >
             Users
            </Sidebar.Item>
            </Link>
          )
         }

{
          currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
            <Sidebar.Item
              as='div' icon={HiOutlineChat} active={tab==='comments'}
              >
             Comments
            </Sidebar.Item>
            </Link>
          )
         }
        

          <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
