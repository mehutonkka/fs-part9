import { useEffect, useState } from 'react'
import { Weather, Visibility, type DiaryEntry} from './types'
import diaryService from './services/diaryService'


const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('')
  const [newWeather, setNewWeather] = useState<Weather>(Weather.Sunny)
  const [newVisibility, setNewVisibility] = useState<Visibility>(Visibility.Great)
  const [newComment, setNewComment] = useState('')

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
      });
    setNewDate('');
    setNewWeather(Weather.Sunny);
    setNewVisibility(Visibility.Great);
    setNewComment('');
  };

  return (
    <div>
      <h2>Add new diary</h2>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
          />
        </div>
        <div>
          visibility
          <input
            value={newVisibility}
            onChange={(event) => setNewVisibility(event.target.value as Visibility)}
          />
        </div>
        <div>
          weather
          <input
            value={newWeather}
            onChange={(event) => setNewWeather(event.target.value as Weather)}
          />
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