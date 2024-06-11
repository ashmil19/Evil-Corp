import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import AdminNavbar from "../../components/navbars/AdminNavbar";
import ReactPaginate from "react-paginate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import profileImg from "../../asset/person.svg";

const StudentManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    isAccess: null,
  });

  const [fetch, setFetch] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  function closeModal() {
    setIsOpen(false);
    setCurrentUser({ id: null, isAccess: null });
  }

  const openModal = (id, isAccess) => {
    setCurrentUser({ id, isAccess });
    setIsOpen(true);
  };

  const fetchStudents = (search) => {
    axiosPrivate
      .get(`/admin/students?page=${currentPage.current}&search=${search}`)
      .then((res) => {
        console.log(res.data.results.students);
        setUsers(res?.data?.results.students);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchStudents();
    setFetch(false);
    return () => setSearchQuery("");
  }, [fetch]);

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchStudents();
  };

  const accessChange = () => {
    axiosPrivate
      .patch(`/admin/updateAccess/${currentUser.id}`, {
        isAccess: currentUser.isAccess,
      })
      .then((res) => {
        console.log(res.data.updatedUser);
        setFetch(true);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    fetchStudents(event?.target?.value);
  };

  return (
    <>
      <div className="w-screen h-screen overflow-x-hidden">
        <AdminNavbar />

        <div className="bg-opacity-50 bg-white text-black p-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-4">
              <div className="flex justify-end items-center mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="p-2 border border-gray-600 rounded-md w-full md:w-64"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mx-auto overflow-x-scroll">
                  <thead className="bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider"
                      >
                        Img
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider"
                      >
                        Fullname
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-400">
                    {users &&
                      users.map((user, index) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <img
                              src={
                                user?.profileImage
                                  ? user.profileImage.url
                                  : profileImg
                              }
                              alt="noimage"
                              className="h-8 w-8 rounded-full"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {user?.fullname}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {user?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div
                              className={
                                user?.isAccess
                                  ? "text-green-600 hover:text-green-900"
                                  : "text-red-600 hover:text-red-900"
                              }
                            >
                              {user.isAccess ? "Active" : "Disable"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              className={
                                user?.isAccess
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }
                              onClick={() =>
                                openModal(user?._id, user?.isAccess)
                              }
                            >
                              {user?.isAccess ? "Block" : "Unblock"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-center py-10">
                <ReactPaginate
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={0}
                  pageCount={pageCount}
                  // initialPage={currentPage.current}
                  forcePage={currentPage.current}
                  previousLabel="<"
                  pageClassName="inline-block mx-1 page-item rounded "
                  pageLinkClassName="border p-2 page-link"
                  previousClassName="inline-block mx-1 page-item font-bold"
                  previousLinkClassName="border p-2 page-link "
                  nextClassName="inline-block mx-1 page-item font-bold"
                  nextLinkClassName="border p-2 page-link"
                  breakLabel="..."
                  breakClassName="page-item inline-flex"
                  breakLinkClassName="page-link "
                  containerClassName="pagination "
                  activeClassName="active bg-red-500"
                  renderOnZeroPageCount={null}
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
  );
};

export default StudentManagement;
