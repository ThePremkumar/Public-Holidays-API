import axios from 'axios';

export const getHolidays = async (req, res) => {
  try {
    const { year } = req.params;
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/IN`);

    const holidays = response.data.map(holiday => ({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type
    }));

    res.json({ holidays });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
};
