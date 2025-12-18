import axios from "axios";


 // Get all public holidays for a year
export const yearWise = async (req, res) => {
  try {
    const { year } = req.params;

    if (!year || isNaN(year)) {
      return res.status(400).json({ error: "Valid year is required" });
    }

    const yearNum = parseInt(year, 10);
    if (yearNum < 1900 || yearNum > 2100) {
      return res
        .status(400)
        .json({ error: "Year must be between 1900 and 2100" });
    }

    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${yearNum}/IN`
    );

    const holidaysByMonth = {};
    response.data.forEach((holiday) => {
      const month = new Date(holiday.date).getMonth() + 1;
      if (!holidaysByMonth[month]) {
        holidaysByMonth[month] = [];
      }
      holidaysByMonth[month].push(holiday);
    });

    res.json({
      success: true,
      year: yearNum,
      totalCount: response.data.length,
      holidays: response.data,
      holidaysByMonth
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: "No holiday data available for this year"
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch holidays"
    });
  }
};


 // Get holidays for a specific month

export const specificMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    if (isNaN(year) || isNaN(month)) {
      return res
        .status(400)
        .json({ error: "Valid year and month are required" });
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (yearNum < 1900 || yearNum > 2100) {
      return res
        .status(400)
        .json({ error: "Year must be between 1900 and 2100" });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res
        .status(400)
        .json({ error: "Month must be between 1 and 12" });
    }

    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${yearNum}/IN`
    );

    const monthHolidays = response.data.filter((holiday) => {
      return new Date(holiday.date).getMonth() + 1 === monthNum;
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    res.json({
      success: true,
      year: yearNum,
      month: monthNum,
      monthName: monthNames[monthNum - 1],
      count: monthHolidays.length,
      holidays: monthHolidays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch holidays"
    });
  }
};


 // Get upcoming holidays

export const upcomingHolidays = async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 5;

    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentYearRes, nextYearRes] = await Promise.all([
      axios.get(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`),
      axios.get(
        `https://date.nager.at/api/v3/PublicHolidays/${currentYear + 1}/IN`
      )
    ]);

    const allHolidays = [
      ...currentYearRes.data,
      ...nextYearRes.data
    ];

    const upcoming = allHolidays
      .filter((h) => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, count)
      .map((h) => ({
        ...h,
        daysUntil: Math.ceil(
          (new Date(h.date) - today) / (1000 * 60 * 60 * 24)
        )
      }));

    res.json({
      success: true,
      count: upcoming.length,
      holidays: upcoming
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch upcoming holidays"
    });
  }
};


 // Check if a specific date is a holiday
 
export const specificDays = async (req, res) => {
  try {
    const { date } = req.params;
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    const year = dateObj.getFullYear();
    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/IN`
    );

    const holiday = response.data.find((h) => h.date === date);

    res.json({
      success: true,
      date,
      isHoliday: Boolean(holiday),
      holiday: holiday || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to check holiday status"
    });
  }
};

 // Get holidays grouped by type

export const holidaysType = async (req, res) => {
  try {
    const { year } = req.params;

    if (isNaN(year)) {
      return res.status(400).json({ error: "Valid year is required" });
    }

    const yearNum = parseInt(year, 10);

    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${yearNum}/IN`
    );

    const typeGroups = {};
    response.data.forEach((holiday) => {
      holiday.types.forEach((type) => {
        if (!typeGroups[type]) {
          typeGroups[type] = [];
        }
        typeGroups[type].push(holiday);
      });
    });

    res.json({
      success: true,
      year: yearNum,
      types: Object.keys(typeGroups),
      holidaysByType: typeGroups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch holiday types"
    });
  }
};
