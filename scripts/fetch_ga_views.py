"""Fetch page view counts from GA4 Data API and write to views.json."""

import json
import os
from datetime import datetime, timezone

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)

PROPERTY_ID = os.environ["GA_PROPERTY_ID"]
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "views.json")


def fetch_views():
    client = BetaAnalyticsDataClient()

    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date="2020-01-01", end_date="today")],
    )

    response = client.run_report(request)

    pages = {}
    total = 0
    for row in response.rows:
        path = row.dimension_values[0].value
        views = int(row.metric_values[0].value)
        pages[path] = views
        total += views

    # Merge "/" and "/index.html" since they are the same page
    home_views = pages.pop("/", 0) + pages.pop("/index.html", 0)
    if home_views:
        pages["/"] = home_views
        pages["/index.html"] = home_views

    data = {
        "lastUpdated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "totalViews": total,
        "pages": pages,
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Updated views.json — {total} total views across {len(pages)} pages")


if __name__ == "__main__":
    fetch_views()
