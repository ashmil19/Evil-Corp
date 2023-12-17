import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import AdminNavbar from '../../components/navbars/AdminNavbar'
import ReactPaginate from 'react-paginate';
import './studentmanagement.css'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ToastHelper from '../../helper/ToastHelper'


const StudentManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const [searchInput, setSearchInput] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: null,
    isAccess: null,
  });

  function closeModal() {
    setIsOpen(false)
    setCurrentUser({id: null,isAccess: null})
  }

  const openModal = (id, isAccess)=> {
    setCurrentUser({id,isAccess})
    setIsOpen(true)
  }



  const handleSearch = (value) => {
    console.log(value);
    setSearchInput(value);

    // Perform the search logic
    const filteredData = users.filter((user) => {
      const fullname = (user.fullname || '').toLowerCase();
      const email = (user.email || '').toLowerCase();

      return (
        fullname.includes(value.toLowerCase()) ||
        email.includes(value.toLowerCase())
      );
    });

    setFilteredUsers(filteredData);
  };


  useEffect(() => {
    axiosPrivate.get("/admin/students")
      .then((res) => {
        console.log(res.data.students);
        setUsers(res.data.students)
        setFilteredUsers(res.data.students)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [setUsers, setFilteredUsers]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };


  const handleItemsPerPageChange = (e) => {
    const selectedItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(0);
  };


  const accessChange = () => {
    axiosPrivate.patch(`/admin/updateAccess/${currentUser.id}`, { isAccess: currentUser.isAccess })
      .then((res) => {
        console.log(res.data.updatedUser);
        closeModal()
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === res.data.updatedUser._id ? { ...user, isAccess: res.data.updatedUser.isAccess } : user))
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const offset = currentPage * itemsPerPage;
  const paginatedData = filteredUsers.slice(offset, offset + itemsPerPage);


  return (
    <>
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
                    {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th> */}
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((user, index) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{index + 1 + currentPage * itemsPerPage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <img src={user.profileImage ? user.profileImage.url : ""} alt=" " className="h-8 w-8 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{user.fullname}</div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{user.userName}</div>
                    </td> */}
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
                          // onClick={() => accessChange(user._id, user.isAccess)}
                          onClick={() => openModal(user._id, user.isAccess)}
                        >
                          {user.isAccess ? "Block" : "Unblock"}
                        </button>
                      </td>
                      {/* <td className="px-6 py-4 flex justify-center whitespace-nowrap text-center">
                      <button
                        type="button"
                        className="hidden md:flex inline-block rounded-full border border-red-900 text-blue-500 dark:bg-yellow-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal hover:text-white dark:text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-red-900 dark:hover:bg-cyan-700 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-cyan-600 dark:focus-bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus-outline-none focus-ring-0 active-bg-cyan-700 dark:active-bg-neutral-200 active-shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]"
                      >
                        View Details
                      </button>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className=''>
                <div className='flex justify-end mt-7 '>
                  <label className="mr-2 bg-gray-800 rounded-full px-6 p-2 text-white">Items per Page<span></span></label>
                  <select onChange={handleItemsPerPageChange} value={itemsPerPage} className='bg-gray-800   rounded-md  text-white'>
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

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Are you sure ?
                  </Dialog.Title>

                  <div className="mt-4 flex items-center justify-evenly">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={accessChange}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default StudentManagement
