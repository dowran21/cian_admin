import BgLoader from "../../components/BgLoader"
import Layout from "../../components/Layout"
import Cell from "../../components/Table/Cell"
import Head from "../../components/Table/Head"
import Table from "../../components/Table/Table"

function Translations (){
    return(
        <Layout>
            <BgLoader loading = {false}/>
            <div className="w-full h-full px-6 py-4 overflow-y-auto">

                <Table>
                    <Head>
                        <>
                        <Cell className={`px-2 py-4 font-medium font-bold flex flex-row justify-start items-center whitespace-nowrap`}>
                            На русском
                        </Cell>
                        <Cell className={`px-2 py-4 font-medium flex flex-row justify-start items-center whitespace-nowrap`}>
                            На туркменком
                        </Cell>
                        <Cell className={`px-2 py-4 font-medium flex flex-row justify-start items-center whitespace-nowrap`}>
                            Изменить
                        </Cell>
                        </>
                    </Head>
                </Table>
            </div>
        </Layout>
    )
}

export default Translations