"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};
const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) {
      console.log("hey");
      return toast.error("provide a valid Amazon link");
    }

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      return toast.success("Valid url");
    }
  };

  return (
    <div>
      <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder="Enter product link"
          className="searchbar-input"
        />

        <button
          type="submit"
          className="searchbar-btn"
          disabled={searchPrompt === ""}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        <Toaster />
      </form>
    </div>
  );
};

export default SearchBar;
