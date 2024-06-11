import React from 'react'
import { Button } from "@material-tailwind/react";

    const items = [1, 2, 3];

const AdminTransactions = () => {
  return (
    <div className='h-2/5 md:h-2/4 w-full flex flex-col justify-center'>
        <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-100 uppercase bg-gray-700 ">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Date
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Transaction ID
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Students
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Courses
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Teacher Acc No
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Phone Number
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Course Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Amout
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      { items.map((item, index)=>{
                        return <tr key={index} className=" border-b bg-gray-800 dark:border-gray-700 text-white">
                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                          16/09/23
                        </th>
                        <td className="px-6 py-4">
                          tsdhgjljkgb123
                        </td>
                        <td className="px-6 py-4">
                          Rinshid
                        </td>
                        <td className="px-6 py-4">
                          Malware
                        </td>
                        <td className="px-6 py-4">
                          Nihad
                        </td>
                        <td className="px-6 py-4">
                          999956778888
                        </td>
                        <td className="px-6 py-4">
                          9999999999
                        </td>
                        <td className="px-6 py-4">
                          1000
                        </td>
                        <td className="px-6 py-4">
                        <Button>Pay</Button>
                        </td>
                    </tr>
                      })
                      
                      }
                      
                  </tbody>
              </table>
          </div>
    </div>
  )
}

export default AdminTransactions
