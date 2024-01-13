import React from 'react'

const RecentTransactions = () => {
  return (
    <div className='h-2/5 md:h-2/4 w-full flex flex-col justify-center'>
      <div className='h-1/6 text-2xl text-white'>Recent Transactions</div>

          <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-100 uppercase bg-gray-700 ">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Students
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Courses
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Amount
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr className=" border-b bg-gray-800 dark:border-gray-700 text-white">
                          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                              Apple MacBook Pro 17"
                          </th>
                          <td className="px-6 py-4">
                              Silver
                          </td>
                          <td className="px-6 py-4">
                              Laptop
                          </td>
                      </tr>
                      <tr className="border-b bg-gray-800 dark:border-gray-700 text-white">
                          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                              Microsoft Surface Pro
                          </th>
                          <td className="px-6 py-4">
                              White
                          </td>
                          <td className="px-6 py-4">
                              Laptop PC
                          </td>
                      </tr>
                      <tr className=" bg-gray-800 text-white">
                          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                              Magic Mouse 2
                          </th>
                          <td className="px-6 py-4">
                              Black
                          </td>
                          <td className="px-6 py-4">
                              Accessories
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

    </div>
  )
}

export default RecentTransactions
