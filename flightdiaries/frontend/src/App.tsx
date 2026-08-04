import { useEffect, useState } from 'react'
import type { DiaryEntry } from './types'
import diaryService from './services/diaryService'


const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => {
      setDiaries(initialDiaries)
    })
  }, [])

  return (
    <div>
      <h1>Flight diaries</h1>

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