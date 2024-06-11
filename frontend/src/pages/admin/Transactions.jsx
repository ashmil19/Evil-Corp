import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { Dialog, Transition } from "@headlessui/react";
import ReactPaginate from "react-paginate";

import AdminNavbar from "../../components/navbars/AdminNavbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Transactions = () => {
  const axiosPrivate = useAxiosPrivate();

  const [fetch, SetFetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  function closeModal() {
    setIsOpen(false);
    setPaymentId(null);
  }

  const openModal = (id) => {
    setPaymentId(id);
    setIsOpen(true);
  };

  const handleTeacherPay = () => {
    axiosPrivate
      .post("/admin/payment", { paymentId })
      .then((res) => {
        SetFetch(true);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchPayments();
  };

  const fetchPayments = () => {
    axiosPrivate
      .get(`/admin/paymentData?page=${currentPage.current}`)
      .then((res) => {
        console.log(res?.data?.results?.payments);
        setPaymentData(res?.data?.results?.payments);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPayments()
    SetFetch(false);
  }, [fetch]);

  return (
    <>
      <div className="h-screen w-screen overflow-x-hidden">
        <AdminNavbar />
        <div className="h-auto text-2xl text-black px-5 py-3 font-bold capitalize">
          Recent Transactions
        </div>

        <div className="h-auto relative overflow-x-auto px-5 py-3">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-100 uppercase bg-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3 capitalize">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Transaction Id
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Teacher
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  price
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentData?.map((payment, index) => (
                <tr
                  key={index}
                  className=" border-b bg-gray-800 dark:border-gray-700 text-white"
                >
                  <td className="px-6 py-4">
                    {new Date(payment?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {(payment?.strip_id).substring(0, 12)}
                  </td>
                  <td className="px-6 py-4">{payment?.course_id?.title}</td>
                  <td className="px-6 py-4">{payment?.teacher_id?.fullname}</td>
                  <td className="px-6 py-4">{payment?.amount}</td>
                  <td className="px-6 py-4">
                    {payment?.isTeacherPay ? (
                      <Button disabled={true} color="red">
                        Paid
                      </Button>
                    ) : (
                      <Button onClick={() => openModal(payment?._id)}>
                        Pay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full flex justify-center py-5">
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
                      onClick={handleTeacherPay}
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

export default Transactions;
