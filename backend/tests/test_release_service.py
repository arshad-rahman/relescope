import unittest

from app.services.release_service import (
    _unique_contributor_names,
)


class TestContributorDeduplication(
    unittest.TestCase,
):
    def test_equivalent_author_names_are_merged(
        self,
    ) -> None:
        contributors = (
            _unique_contributor_names(
                [
                    "arshad rahman",
                    "arshad-rahman",
                    "Arshad_Rahman",
                    "  Arshad   Rahman  ",
                ]
            )
        )

        self.assertEqual(
            contributors,
            [
                "arshad rahman",
            ],
        )


    def test_different_authors_are_preserved(
        self,
    ) -> None:
        contributors = (
            _unique_contributor_names(
                [
                    "Arshad Rahman",
                    "Jane Doe",
                    "john-smith",
                ]
            )
        )

        self.assertEqual(
            contributors,
            [
                "Arshad Rahman",
                "Jane Doe",
                "john-smith",
            ],
        )


    def test_empty_names_are_ignored(
        self,
    ) -> None:
        contributors = (
            _unique_contributor_names(
                [
                    "",
                    "   ",
                    "Arshad Rahman",
                ]
            )
        )

        self.assertEqual(
            contributors,
            [
                "Arshad Rahman",
            ],
        )


if __name__ == "__main__":
    unittest.main()
