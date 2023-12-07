import React, { useState } from 'react'
import AdminNavbar from '../../components/navbars/AdminNavbar'
import ReactPaginate from 'react-paginate';
import './studentmanagement.css'



const StudentManagement = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [itemsPerPage,setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };


  const handleItemsPerPageChange = (e) => {
    const selectedItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const paginatedData = filteredUsers.slice(offset, offset + itemsPerPage);


  return (
    <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
        <AdminNavbar />
        
      <div className="bg-opacity-50 bg-white text-black p-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-4">
            <div className="flex justify-end items-center mb-4">

              <input
                type="text"
                placeholder="Search..."
                className="p-2 border rounded-md w-full md:w-64"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}  
              />
            </div>

            <table className="min-w-full divide-y divide-gray-200 mx-auto overflow-x-scroll">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sl No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Img
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fullname
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((user, index) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{index + 1 + currentPage * itemsPerPage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img src={user.pic.url} alt="User" className="h-8 w-8 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={user.isAccess ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}>{user.isAccess ? "Active" : "Disable"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {/* Add action buttons here */}
                      <button
                        className={user.isAccess ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        onClick={() => acessChange(user.email, user.isAccess)}
                      >
                        {user.isAccess ? "Block" : "Unblock"}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex justify-center whitespace-nowrap text-center">
                      <button
                        type="button"
                        className="hidden md:flex inline-block rounded-full border border-red-900 text-blue-500 dark:bg-yellow-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal hover:text-white dark:text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-red-900 dark:hover:bg-cyan-700 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-cyan-600 dark:focus-bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus-outline-none focus-ring-0 active-bg-cyan-700 dark:active-bg-neutral-200 active-shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className=''>
              <div className='flex justify-end mt-7 '>
                <label className="mr-2 bg-orange-400 rounded-full px-6 p-2 text-white">Items per Page<span></span></label>
                <select onChange={handleItemsPerPageChange} value={itemsPerPage} className='bg-orange-400   rounded-md  text-white'>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>


            </div>
            <div className='flex-column-center'>
              <ReactPaginate
                pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="pagination-container"
                activeClassName="active"
                breakLabel={'...'}
                breakClassName={'break-me'}
                previousLabel={<span className="pagination-arrow">&lt;</span>}
                nextLabel={<span className="pagination-arrow">&gt;</span>}
                pageLinkClassName='pagination-page'
              />
            </div>

          </div>
        </div>
      </div>



    </div>
  )
}

export default StudentManagement
