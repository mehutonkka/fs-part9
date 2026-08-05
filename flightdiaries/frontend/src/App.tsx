import { useEffect, useState } from 'react'
import { Weather, Visibility, type DiaryEntry} from './types'
import diaryService from './services/diaryService'
import axios from 'axios'

interface ZodIssue {
  message: string
  path: (string | number)[]
}

interface ErrorResponse {
  error: ZodIssue[]
}

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('')
  const [newWeather, setNewWeather] = useState<Weather>(Weather.Sunny)
  const [newVisibility, setNewVisibility] = useState<Visibility>(Visibility.Great)
  const [newComment, setNewComment] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => {
      setDiaries(initialDiaries)
    })
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    diaryService
      .create({ date: newDate, weather: newWeather, visibility: newVisibility, comment: newComment })
      .then((returnedDiary) => {
        setDiaries(diaries.concat(returnedDiary));
        setNewDate('');
        setNewWeather(Weather.Sunny);
        setNewVisibility(Visibility.Great);
        setNewComment('');
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
          const message = error.response.data.error
            .map((issue) => {
              const field = issue.path.join('.');
              return `Error: ${field}: ${issue.message}`;
            })
            .join(', ');
          setErrorMessage(message);
        } else {
          setErrorMessage('unknown error occurred');
        }
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    
  };

  return (
    <div>
      <h2>Add new diary</h2>

      {errorMessage && (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      )}
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
          />
        </div>
        <div>
          visibility
          <input
            type="radio"
            name="visibility"
            value={Visibility.Great}
            onChange={() => setNewVisibility(Visibility.Great)}
            checked={newVisibility === Visibility.Great}
          />
          <label>great</label>
          <input
            type="radio"
            name="visibility"
            value={Visibility.Good}
            onChange={() => setNewVisibility(Visibility.Good)}
            checked={newVisibility === Visibility.Good}
          />
          <label>good</label>
          <input
            type="radio"
            name="visibility"
            value={Visibility.Ok}
            onChange={() => setNewVisibility(Visibility.Ok)}
            checked={newVisibility === Visibility.Ok}
          />
          <label>ok</label>
          <input
            type="radio"
            name="visibility"
            value={Visibility.Poor}
            onChange={() => setNewVisibility(Visibility.Poor)}
            checked={newVisibility === Visibility.Poor}
          />
          <label>poor</label>
        </div>
        <div>
          weather
          <input
            type="radio"
            name="weather"
            value={Weather.Sunny}
            onChange={() => setNewWeather(Weather.Sunny)}
            checked={newWeather === Weather.Sunny}
          />
          <label>sunny</label>
          <input
            type="radio"
            name="weather"
            value={Weather.Rainy}
            onChange={() => setNewWeather(Weather.Rainy)}
            checked={newWeather === Weather.Rainy}
          />
          <label>rainy</label>
          <input
            type="radio"
            name="weather"
            value={Weather.Cloudy}
            onChange={() => setNewWeather(Weather.Cloudy)}
            checked={newWeather === Weather.Cloudy}
          />
          <label>cloudy</label>
          <input
            type="radio"
            name="weather"
            value={Weather.Stormy}
            onChange={() => setNewWeather(Weather.Stormy)}
            checked={newWeather === Weather.Stormy}
          />
          <label>stormy</label>
          <input
            type="radio"
            name="weather"
            value={Weather.Windy}
            onChange={() => setNewWeather(Weather.Windy)}
            checked={newWeather === Weather.Windy}
          />
          <label>windy</label>
        </div>
        <div>
          comment
          <input
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Flight diaries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h2>{diary.date}</h2>
          <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div>
        </div>
      ))}      
    </div>
  )
}

export default App