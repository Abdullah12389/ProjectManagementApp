"use client"
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { Drawer,Box, Typography } from '@mui/material';
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import Search from '../../components/ui/search';
import { router, usePage } from '@inertiajs/react';
import { BeakerIcon,UserGroupIcon } from '@heroicons/react/16/solid';
export type Dictionary={
    [key:string]:string[];
}

type Project={
    id:number
    name:string
}

type WorkSpace={
    id:number
    name:string
    project:Project[]
}

type SideBarData={
    workspace:WorkSpace[]
}

interface PageProps{
  SideBarData:SideBarData[]
  [key:string]:any
}

export default function SideBar({data,show,setView,icons}:{data:Dictionary,show:any,setView:any,icons:any}) {
  const [showSearch,setShowSearch]=useState(false);
  const { sidebarData }=usePage<PageProps>().props;
  useEffect(()=>{
    if(showSearch) setShowSearch(false)
  },[show])
  return (
    <Box>
      <Drawer 
        open={show} 
        onClose={()=>setView(false)}
        slotProps={{
        paper:{
          className:"w-1/4"
        }
      }}>
          <SimpleTreeView> 
            <Box className="flex w-full items-center justify-between mt-10 mb-10">
              <Bars3Icon className='w-7 h-7 ml-7' onClick={()=>setView(false)}/>
              {/* {
                showSearch?<Search className='w-40 h-10! mr-7!'/>:<MagnifyingGlassIcon className='w-7 h-7 mr-7' onClick={()=>setShowSearch(true)}/>
              } */}
            </Box>
            <Typography variant='h6' sx={{marginLeft:2}} onClick={()=>router.visit('/workspace')}>WorkSpaces</Typography>
            {sidebarData.workspace.map((data:WorkSpace,index:number)=>{
              // const Icon=icons[index]
              return(
                <TreeItem
                key={index} 
                itemId={`${index}`} 
                slotProps={{
                  label:{
                    children:(
                      <Box className="flex items-center" onClick={()=>router.visit(`/workspace/${data.id}`)}>
                        <UserGroupIcon className='w-5 h-5'/>
                        <Typography>{data.name}</Typography>
                      </Box>
                    )
                  }
                }}>
                  {
                    data.project.map((value:Project,i:number)=>(
                      <TreeItem 
                      key={i}
                      itemId={`${index}+${i}`} 
                      onClick={()=>router.visit(`/project/${value.id}`)}
                      slotProps={{
                        label:{
                          children:(
                            <Box className="flex items-center" onClick={()=>router.visit(`/workspace/${data.id}`)}>
                              <BeakerIcon className='w-5 h-5'/>
                              <Typography>{value.name}</Typography>
                            </Box>
                          )
                        }
                      }}
                      />
                    ))
                  }
                </TreeItem>
              );
            })}
          </SimpleTreeView>
      </Drawer>
    </Box>
  );
}