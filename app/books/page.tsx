"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { phrases } from "@/utils/i18n";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Link from "next/link";
import LoadingPage from "../loading";
import { trackPageVisit, trackSession, trackButtonClick } from "@/utils/analytics";

// Type definitions
interface Book {
  id: string;
  index: number;
  title: string;
  author: string;
  translator?: string;
  Book_Picture: [{ url: string; filename: string; type: string; size: number }];
  Book_Links: [{ url: string; filename: string; type: string; size: number }];
  no: number;
}

interface Phrases {
  author: Record<string, string>;
  translator: Record<string, string>;
  digitalLibrary: Record<string, string>;
  bookSearch: Record<string, string>;
  bookSearchPlaceholder: Record<string, string>;
  readMore: Record<string, string>;
  noBookFound: Record<string, string>;
  noBookFoundDetail: Record<string, string>;
  prevPage: Record<string, string>;
  nextPage: Record<string, string>;
  bookTitle: Record<string, string>;
}

export default function Index() {
  const {
    author,
    translator,
    digitalLibrary,
    bookSearchPlaceholder,
    bookSearch,
    readMore,
    noBookFound,
    noBookFoundDetail,
    prevPage,
    nextPage,
    bookTitle,
  } = phrases as Phrases;
  const [loadingPage, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage] = useState<number>(10); // You can adjust this number
  const { state } = useAppContext();
  const { language: lang } = state;

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/getBooks");
      const sortedBooks = res.data.sort((a: Book, b: Book) =>
        a.title.localeCompare(b.title)
      );
      setBooks(sortedBooks);
      setFilteredBooks(sortedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Track page visit and session on mount
  useEffect(() => {
    trackSession();
    trackPageVisit("books-library");
  }, []);

  // Filter books based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.translator &&
            book.translator.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, books]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    // Track pagination click
    trackButtonClick({
      buttonType: "suggestion-click",
      buttonLabel: `Page ${page}`,
      additionalData: {
        fromPage: currentPage,
        toPage: page,
        totalPages: totalPages,
      },
    });
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Track book click
  const handleBookClick = (book: Book) => {
    trackButtonClick({
      buttonType: "suggestion-click",
      buttonLabel: book.title,
      additionalData: {
        bookId: book.id,
        author: book.author,
        translator: book.translator || "N/A",
      },
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loadingPage) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {digitalLibrary[lang]}
          </h1>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <TextField
            id="book-search"
            label={bookSearch[lang]}
            type="search"
            variant="outlined"
            placeholder={bookSearchPlaceholder[lang]}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            size="small"
          />
          {/* {filteredBooks.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              نمایش {startIndex + 1} تا{" "}
              {Math.min(endIndex, filteredBooks.length)} از{" "}
              {filteredBooks.length} کتاب
            </div>
          )} */}
        </div>

        {/* Books Grid */}
        {currentBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {currentBooks.map((book: Book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                >
                  <Link
                    href={book.Book_Links[0].url}
                    target="_blank"
                    className="h-full flex flex-col justify-between"
                    onClick={() => handleBookClick(book)}
                  >
                    {/* Book Cover */}
                    <div className="relative w-full aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={book.Book_Picture[0].url}
                        alt={`غلاف کتاب ${book.title}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        unoptimized={true}
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-grow flex flex-col">
                      <h2 className={`${lang !== "en"? "text-xl" : "text-lg"}  font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mb-2 line-clamp-2`}>
                       {bookTitle[lang]}: {book.title}
                      </h2>

                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="font-medium truncate">
                          {author[lang]}: {book.author}
                        </span>
                      </div>

                      {book?.translator && book.translator.length > 0 && (
                        <div className="flex items-center text-gray-600  mb-3">
                          <span className="font-medium truncate">
                            {translator[lang]}: {book.translator}
                          </span>
                        </div>
                      )}

                      {/* Read Button */}
                      <div className="mt-auto pt-3">
                        <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
                          <span className="font-medium ml-1">
                            {readMore[lang]}
                          </span>
                          <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6L8 4 2 10l6 6 2-2m-2-4h8m4 0l2-2-2-2"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 mr-2 ${
                        lang !== "en" && "rotate-180"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    {prevPage[lang]}
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => goToPage(page as number)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                              currentPage === page
                                ? "bg-[var(--color-primary)] text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md"
                    } `}
                  >
                    {nextPage[lang]}
                    <svg
                      className={`w-4 h-4 mr-2 ${
                        lang !== "en" && "rotate-180"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {noBookFound[lang]}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {noBookFoundDetail[lang]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
