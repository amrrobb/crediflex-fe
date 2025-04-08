"use client";

import type React from "react";
import { useCallback } from "react";

export function useSmoothScroll() {
	const scrollToElement = useCallback((elementId: string) => {
		if (typeof window === "undefined" || typeof document === "undefined") {
			return () => {};
		}

		const element = document.getElementById(elementId);
		if (!element) return () => {};

		// Prevent default anchor link behavior
		const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();

			// Get the target element's position
			const targetPosition =
				element.getBoundingClientRect().top + window.pageYOffset;

			// Get the header height (assuming 64px, adjust if different)
			const headerOffset = 30;
			const offsetPosition = targetPosition - headerOffset;

			// Smooth scroll to the target
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		};

		return handleClick;
	}, []);

	return { scrollToElement };
}
