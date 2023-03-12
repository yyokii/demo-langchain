import { OpenAI } from 'langchain'
import { loadAgent, AgentExecutor } from 'langchain/agents'
import { SerpAPI } from 'langchain/tools'

require('dotenv').config()

const main = async () => {
  const arg = process.argv.slice(2)
  // 引数があればそれをトピックにする
  const topic = arg.length > 0 ? ` on the topic ${arg}` : ''

  const model = new OpenAI({ temperature: 0.9 })
  const tools = [new SerpAPI()]

  const agent = await loadAgent('lc://agents/zero-shot-react-description/agent.json', {
    llm: model,
    tools,
  })

  const executor = new AgentExecutor({ agent: agent, tools: tools, returnIntermediateSteps: true })

  //   const input = `
  //   Come up with an idea for a software-based service${topic}.
  //   And please use the following flow.
  //   First, think about the challenge.
  //   You can find things that people find annoying or inconvenient from sns posts, web pages, or browser search results. Describe the challenge you are trying to solve based on this information.
  //   Please describe it in about 30 words so that it can be clearly explained.
  //   Next, come up with a solution.
  //   Think of a service that solves the above problem. The service can be anything a software engineer can create, such as a web app, mobile app, CLI tool, etc. Please describe it in about 30 words so that it is clear.
  //   Please describe in about 30 words so that it can be clearly explained.
  //   Please output as follows
  //   Challenge:
  //   (describe the challenge here)
  //   Solution:
  //   (describe the solution here)
  //  `
  /* 
  結果はありきたりなアイデアしかでなかった。単純にめんどくさいこととかをまとめる方がいいのかも？
  */

  const input = `What are five apparel brands that sell fashionable sweatshirts?
    The target is Japanese men in their 20s.
    We would like to know what brands are popular now based on the results of sns and web searches.
    I would like to know which brands have good taste and are fashionable, other than the well-known high brands such as Gucci and Valencia.
    Please output the results with the brand names as bullet points.`

  /* 
  結果: The top five trendy apparel brands that sell fashionable sweatshirts in Japan are Uniqlo, A Bathing Ape, Beams, Phenomé, and Wacko Maria.
  出力が箇条書きにならないのはtemperature: 0.9にしてるのも原因？
  ありきたりなブランドしかでなかった
  */

  console.log('Start to generate ideas...')

  try {
    const result = await executor.call({ input })
    console.log(result.output)
  } catch (e) {
    console.error(e)
  }
}

main()
