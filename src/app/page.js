import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Personal Budgeting Manager</h1>
      <div>
        <h2>Budgets Created:</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Food</td>
              <td>$100</td>
            </tr>
            <tr>
              <td>Transportation</td>
              <td>$50</td>
            </tr>
            <tr>
              <td>Entertainment</td>
              <td>$150</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
