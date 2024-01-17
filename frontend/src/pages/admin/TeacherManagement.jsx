import React, { useEffect, useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import AdminNavbar from "../../components/navbars/AdminNavbar";
import ReactPaginate from "react-paginate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import profileImg from "../../asset/person.svg";
import { Button } from "@material-tailwind/react";
import { Oval } from "react-loader-spinner";

const TeacherManagement = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [approveIsOpen, setApproveIsOpen] = useState(false);
  const [rejectIsOpen, setRejectIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    isAccess: null,
    isVerify: null,
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

  function closeApproveModal() {
    setApproveIsOpen(false);
    setCurrentUser({ id: null, isVerify: null });
  }

  const openApproveModal = (id, isVerify) => {
    setApproveIsOpen(true);
    setCurrentUser({ id, isVerify });
  };

  function closeRejectModal() {
    setRejectIsOpen(false);
    setCurrentUser({ id: null, isVerify: null });
  }

  const openRejectModal = (id, isVerify) => {
    setRejectIsOpen(true);
    setCurrentUser({ id, isVerify });
  };

  const fetchTeacher = (search) => {
    axiosPrivate
      .get(`/admin/teachers?page=${currentPage.current}&search=${search}`)
      .then((res) => {
        setUsers(res?.data?.results?.teachers);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTeacher();
    setFetch(false);
    return () => setSearchQuery("");
  }, [fetch]);

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchTeacher();
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
        closeModal();
      });
  };

  const teacherVerify = () => {
    axiosPrivate
      .post("/admin/teacherApprove", {
        teacherId: currentUser.id,
      })
      .then((res) => {
        setFetch(true);
        closeApproveModal();
      })
      .catch((err) => {
        console.log(err);
        closeApproveModal();
      });
  };

  const teacherReject = () => {
    setLoading(true)
    axiosPrivate
    .post("/admin/teacherReject", {
        teacherId: currentUser.id,
      })
      .then((res) => {
        setFetch(true);
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err);
      });

      closeRejectModal();
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    fetchTeacher(event?.target?.value);
  };
  return (
    <>
      <div className="h-screen w-screen overflow-x-hidden">
        <AdminNavbar />

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        <div className="bg-white bg-opacity-50 p-4 text-black">
          <div className="mx-auto max-w-screen-xl">
            <div className="mb-4">
              <div className="mb-4 flex items-center justify-end">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md border border-gray-600 bg-gray-100 p-2 text-gray-800 md:w-64"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="mx-auto min-w-full divide-y divide-gray-200 overflow-x-scroll">
                  <thead className="bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                      >
                        Img
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                      >
                        Fullname
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 bg-gray-100">
                    {users &&
                      users.map((user, index) => (
                        <tr key={user._id}>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
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
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">
                              {user?.fullname}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">
                              {user?.email}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <div
                              className={
                                !user?.isVerify
                                  ? "text-orange-600 hover:text-orange-900"
                                  : user?.isAccess
                                    ? "text-green-600 hover:text-green-900"
                                    : "text-red-600 hover:text-red-900"
                              }
                            >
                              {!user?.isVerify
                                ? "Not Verify"
                                : user?.isAccess
                                  ? "Active"
                                  : "Disable"}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            {user?.isVerify ? (
                              <Button
                                size="sm"
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
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openApproveModal(user?._id, user?.isVerify)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openRejectModal(user?._id, user?.isVerify)
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex w-full justify-center py-10">
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
                    className="text-center text-lg font-medium leading-6 text-gray-900"
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

      {/* approve modal */}
      <Transition appear show={approveIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeApproveModal}>
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
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure ?
                  </Dialog.Title>

                  <div className="mt-4 flex items-center justify-evenly">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={teacherVerify}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeApproveModal}
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

      {/* reject modal */}
      <Transition appear show={rejectIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeRejectModal}>
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
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure ?
                  </Dialog.Title>

                  <div className="mt-4 flex items-center justify-evenly">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={teacherReject}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeRejectModal}
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

export default TeacherManagement;
